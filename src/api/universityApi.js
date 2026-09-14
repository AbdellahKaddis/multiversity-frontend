import { baseUrl } from "./authApi";

const universityApi = {
    createUniversity:async({universityName, universityType, universityEmail, adminId}) => {
            try{
                const response = await fetch(`${baseUrl}universities`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: universityName,
                    email: universityEmail,
                    type: universityType,
                    adminId
                })
            })

        const data = await response.json();
                
        return {data,status:response.status};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
            else
                throw new Error(error.message)
            }
    },
    getUniversity:async(universityId) => {
            try{
                const response = await fetch(`${baseUrl}universities/${universityId}`);
                const data = await response.json();

                return {data,status:response.status};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    },
    checkForDuplicateValues:async({name, email}) => {
            try{
                const response = await fetch(`${baseUrl}universities/${email}/${name}`,)
                var data = null;
                if(response.status !== 200)
                    data = await response.json();

                return {data,status:response.status};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
            else
                throw new Error(error.message)
            }
    },
    getUniversityByAdminId: async(adminId) => {
        try{
                const response = await fetch(`${baseUrl}admins/${adminId}/university`,)
                const data = await response.json();

                return {data,status:response.status};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    },
        getUniversityStatistics:async(universityId) => {
            try{
                const response = await fetch(`${baseUrl}universities/${universityId}/statistics`);
                const data = await response.json();

                return {data,status:response.status};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    },
};
export default universityApi;