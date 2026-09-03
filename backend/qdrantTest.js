import "dotenv/config"
import { COLLECTION_NAME,createCollection } from "./src/services/qdrantCollectionsServices.js";

const test = async()=>{
    try {
        await createCollection()
        console.log("Qdrant collection created");
        
    } catch (error) {
        console.error("qdrant error",error);
        
    }
}
test()