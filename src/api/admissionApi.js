import { baseUrl } from "./authApi";
const admissionApi = {
    getAdmissions : async(universityId, facultyId=null, programId=null)=>{
            try{
                const response = await fetch(`${baseUrl}${universityId}/admissions${facultyId && programId ? `?facultyId=${facultyId}&programId=${programId}` : (facultyId ? "?facultyId="+facultyId: programId ? "?programId="+programId: "")}`);
                const data = await response.json();
                return { data, status : response.status };
            }catch(error){
                if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                    throw new Error(error.message)
            }
    
        },
            getAdmission : async(admissionId)=>{
            try{
                const response = await fetch(`${baseUrl}admissions/${admissionId}`);
                const data = await response.json();
                return { data, status : response.status };
            }catch(error){
                if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                    throw new Error(error.message)
            }
    
        },
        createAdmission : async({ programId, title, academicYear, startDate, endDate, process, requirements }) => {
                try{
                    const response = await fetch(`${baseUrl}admissions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        programId, title, academicYear, startDate, endDate, process, requirements 
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
        updateAdmission : async({ admissionId,  programId, title, academicYear, startDate, endDate, process, requirements }) => {
                try{
                    const response = await fetch(`${baseUrl}admissions/${admissionId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         programId, title, academicYear, startDate, endDate, process, requirements 
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
        deleteAdmission : async(admissionId) => {
                try{
                    const response = await fetch(`${baseUrl}admissions/${admissionId}`,
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
export default admissionApi;