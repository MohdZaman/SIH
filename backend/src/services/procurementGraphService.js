import Recommendation from "../models/recommendationModel.js";
import StandardRelation from "../models/standardRelationshipModel.js";

export const getProcurementGraph = async (procurementId, depth = 1) => {

    const recommendations = await Recommendation.find({
        procurement: procurementId
    }).populate(
        "standard",
        "code title version standardFamily"
    );

    const nodes = [];
    const edges = [];

    const visited = new Set();

    const addNode = (standard) => {

        if (!standard) {
            return;
        }

        const id = standard._id.toString();

        if (visited.has(id)) {
            return;
        }

        visited.add(id);

        nodes.push({
            id,
            code: standard.code,
            title: standard.title,
            version: standard.version,
            standardFamily: standard.standardFamily
        });
    };

    const traverse = async (standardId, currentDepth) => {

        if (currentDepth > depth) {
            return;
        }

        const relations = await StandardRelation.find({
            sourceStandard: standardId
        })
            .populate(
                "sourceStandard",
                "code title version standardFamily"
            )
            .populate(
                "targetStandard",
                "code title version standardFamily"
            );

        for (const relation of relations) {

            if (
                !relation.sourceStandard ||
                !relation.targetStandard
            ) {
                continue;
            }

            const source = relation.sourceStandard;
            const target = relation.targetStandard;

            addNode(source);
            addNode(target);

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

    // Add recommended standards
    for (const recommendation of recommendations) {

        if (!recommendation.standard) {
            continue;
        }

        addNode(recommendation.standard);

        await traverse(
            recommendation.standard._id,
            1
        );
    }

    // Remove duplicate edges
    const uniqueEdges = Array.from(
        new Map(
            edges.map(edge => [
                edge.id,
                edge
            ])
        ).values()
    );

    return {
        nodes,
        edges: uniqueEdges
    };
};