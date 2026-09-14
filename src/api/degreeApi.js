import { baseUrl } from "./authApi";
const degreeApi = {
    getDegrees : async(universityId)=>{
            try{
                const response = await fetch(`${baseUrl}universities/${universityId}/degrees`);
                const data = await response.json();
                return { data, status : response.status };
            }catch(error){
                if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                    throw new Error(error.message)
            }
    
        },
        createDegree : async({universityId, name}) => {
                try{
                    const response = await fetch(`${baseUrl}universities/${universityId}/degrees`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                    })
                });
    
                const data = await response.json();

                return {data,status:response.status};
                }catch(error){
                    if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                    else
                    throw new Error(error.message)
                }
        },
        updateDegree : async({degreeId, universityId, name}) => {
                try{
                    const response = await fetch(`${baseUrl}degrees/${degreeId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        universityId
                    })
                });
                
                return {status:response.status};
                }catch(error){
                    if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                    else
                    throw new Error(error.message)
                }
        },
        deleteDegree : async(degreeId) => {
                try{
                    const response = await fetch(`${baseUrl}degrees/${degreeId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                return {status:response.status};
                }catch(error){
                    if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                    else
                    throw new Error(error.message)
                }
        },
};
export default degreeApi;