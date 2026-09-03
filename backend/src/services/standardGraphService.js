import StandardRelation from "../models/standardRelationshipModel.js";

export const getStandardGraph = async (
    standardId,
    depth = 1
) => {

    const visited = new Set();

    const nodes = [];
    const edges = [];

    const traverse = async (
        currentStandardId,
        currentDepth
    ) => {

        if (
            currentDepth > depth ||
            visited.has(currentStandardId.toString())
        ) {
            return;
        }

        visited.add(
            currentStandardId.toString()
        );

        const relations =
            await StandardRelation.find({
                sourceStandard:
                    currentStandardId
            })
                .populate(
                    "sourceStandard",
                    "code title version standardFamily"
                )
                .populate(
                    "targetStandard",
                    "code title version standardFamily"
                );

        for (
            const relation
            of relations
        ) {

            if (
                !relation.sourceStandard ||
                !relation.targetStandard
            ) {
                continue;
            }

            const source =
                relation.sourceStandard;

            const target =
                relation.targetStandard;

            nodes.push({
                id: source._id,
                code: source.code,
                title: source.title,
                version: source.version,
                standardFamily:
                    source.standardFamily
            });

            nodes.push({
                id: target._id,
                code: target.code,
                title: target.title,
                version: target.version,
                standardFamily:
                    target.standardFamily
            });

           edges.push({
    id: relation._id.toString(),

    source: source._id.toString(),
    target: target._id.toString(),

    relationType: relation.relationType,

    evidenceText: relation.evidenceText,

    evidenceSource: relation.source,
    sourceUrl: relation.sourceUrl,
    clause: relation.clause,
    page: relation.page,
    confidence: relation.confidence
});

            await traverse(
                target._id,
                currentDepth + 1
            );
        }
    };

    await traverse(
        standardId,
        1
    );

    const uniqueNodes =
        Array.from(
            new Map(
                nodes.map(
                    node => [
                        node.id.toString(),
                        node
                    ]
                )
            ).values()
        );

    const uniqueEdges =
        Array.from(
            new Map(
                edges.map(
                    edge => [
                        edge.id.toString(),
                        edge
                    ]
                )
            ).values()
        );

    return {
        nodes: uniqueNodes,
        edges: uniqueEdges
    };
};