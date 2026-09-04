import Standard from './../models/standardModel.js';
import { generateEmbedding } from './geminiServices.js';
import qdrant from './qdrantServices.js';
import {COLLECTION_NAME} from './qdrantCollectionsServices.js'
import {v5 as uuidv5} from 'uuid'

const QDRANT_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

const indexStandard = async(standard)=>{
    const text = `
    Code:${standard.code}
    Title:${standard.title}
    Description:${standard.description}
    Category:${standard.category}
    Keywords: ${(standard.keywords || []).join(", ")}
    `
     const vector = await generateEmbedding(text);
       const pointId = uuidv5(
        standard._id.toString(),
        QDRANT_NAMESPACE
    );

    await qdrant.upsert(COLLECTION_NAME, {
        wait: true,
        points: [
            {
                id: pointId,
                vector: vector,
                payload: {
                    standardId: standard._id.toString(),
                    code: standard.code,
                    title: standard.title,
                    category: standard.category,
                    latestVersion: standard.latestVersion
                }
            }
        ]
    });

    return vector;
};

const indexAllStandards = async () => {

    const standards = await Standard.find();

    for (const standard of standards) {
        await indexStandard(standard);
    }

    console.log(`${standards.length} standards indexed`);
};
const searchSimilarStandards = async (text, limit = 5) => {

    const vector = await generateEmbedding(text);

    const results = await qdrant.query(COLLECTION_NAME, {
        query: vector,
        limit: limit,
        with_payload: true
    });

    return results;
};

export {
    indexStandard,
    indexAllStandards,
    searchSimilarStandards
};

