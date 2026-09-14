import { baseUrl } from "./authApi";

const departmentApi = {
    getDepartments : async(facultyId)=>{
        try{
            const response = await fetch(`${baseUrl}faculties/${facultyId}/departments`);
            const data = await response.json();
            return { data, status : response.status };
        }catch(error){
            if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
            else
                throw new Error(error.message)
        }

    },
    createDepartment : async({facultyId, name, code, email, description}) => {
            try{
                const response = await fetch(`${baseUrl}faculties/${facultyId}/departments`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    code,
                    email,
                    description
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
    updateDepartment : async({facultyId, departmentId, name, code, email, description}) => {
            try{
                const response = await fetch(`${baseUrl}faculties/${facultyId}/departments/${departmentId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    code,
                    email,
                    description
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
    deleteDepartment : async(facultyId, departmentId) => {
            try{
                const response = await fetch(`${baseUrl}faculties/${facultyId}/departments/${departmentId}`,
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
export default departmentApi;