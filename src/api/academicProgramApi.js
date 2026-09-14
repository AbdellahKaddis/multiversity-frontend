import { baseUrl } from "./authApi";
const academicProgramApi = {
    getAcademicPrograms : async(facultyId=null, departmentId=null, universityId=null)=>{
            try{
                const response = await fetch(`${baseUrl}programs${facultyId || departmentId ? facultyId && departmentId === null ? `?facultyId=${facultyId}`:`?departmentId=${departmentId}` : universityId ? `?universityId=${universityId}`:''}`);
                const data = await response.json();
                return { data, status : response.status };
            }catch(error){
                if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                    throw new Error(error.message)
            }
    
        },
        createAcademicProgram : async({departmentId, name, code, durationInYears, description, degreeId}) => {
                try{
                    const response = await fetch(`${baseUrl}departments/${departmentId}/programs`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        code,
                        durationInYears,
                        description,
                        degreeId
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
        updateAcademicProgram : async({departmentId, programId, name, code, durationInYears, description, degreeId}) => {
                try{
                    const response = await fetch(`${baseUrl}programs/${programId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        code,
                        durationInYears,
                        description,
                        degreeId,
                        departmentId
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
        deleteAcademicProgram : async(programId) => {
                try{
                    const response = await fetch(`${baseUrl}programs/${programId}`,
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
        getAcademicProgram:async(programId) => {
            try{
                const response = await fetch(`${baseUrl}programs/${programId}`);
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
export default academicProgramApi;