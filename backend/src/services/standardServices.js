import Standard from "../models/standardsModel.js";

const searchStandards = async (requirement) => {

    const keywords = [
        ...(requirement.keywords || []),
        requirement.product,
        requirement.application
    ]
        .filter(Boolean)
        .map(keyword => keyword.toLowerCase());

    const standards = await Standard.find({
        $or: keywords.flatMap(keyword => [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
            { category: { $regex: keyword, $options: "i" } },
            { keywords: { $regex: keyword, $options: "i" } }
        ])
    });

    return standards;
};

export { searchStandards };