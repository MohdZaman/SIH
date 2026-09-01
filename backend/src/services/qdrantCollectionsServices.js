import qdrant from "./qdrantServices.js";

const COLLECTION_NAME =  "bis_standards";
const createCollection = async()=>{
    const collections = await qdrant.getCollections()
    const exists = collections.collections.some(
        collection=>collection.name===COLLECTION_NAME
    )
    if(exists){
        console.log("Collection already exist");
        return 
        
    }
    await qdrant.createCollection(COLLECTION_NAME,{
        vectors:{
            size:3072,
            distance:"Cosine"
        }
        
    })
    console.log("Qdrant collection created");
    
}
export {COLLECTION_NAME,createCollection}