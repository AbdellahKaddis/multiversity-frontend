import { baseUrl } from './authApi';
const facultyApi = {
    createFaculty:async({universityId, name, code, type, region, city, address, email, phoneNumber, establishedYear}) => {
            try{
                const response = await fetch(`${baseUrl}universities/${universityId}/faculties`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    code,
                    type,
                    region,
                    city,
                    address,
                    email,
                    phoneNumber,
                    establishedYear
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
    getFaculties:async(universityId) => {
            try{
                const response = await fetch(`${baseUrl}universities/${universityId}/faculties`);
                const data = await response.json();

                return {data,status:response.status};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    },
    getFaculty:async(universityId,facultyId) => {
            try{
                const response = await fetch(`${baseUrl}universities/${universityId}/faculties/${facultyId}`);
                const data = await response.json();

                return {data,status:response.status};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    },
     endDeanAssignment:async(facultyId) => {
            try{
                const response = await fetch(`${baseUrl}faculties/${facultyId}/dean/end`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    if (response.status === 204) {
    return { data: null, status: response.status };
}

const data = await response.json();

return { data, status: response.status };
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    },
         createAndAssignDean:async(facultyId,{firstName, lastName, email}) => {
            try{
                const response = await fetch(`${baseUrl}faculties/${facultyId}/dean`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                })
            });

           

if (response.status === 201) {
    return {
        data: null,
        status: response.status
    };
}

const data = await response.json();

return {
    data,
    status: response.status
};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    },
    updateFaculty:async({universityId, facultyId, name, code, type, region, city, address, email, phoneNumber, establishedYear})=>{
        try{
                const response = await fetch(`${baseUrl}universities/${universityId}/faculties/${facultyId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    code,
                    type,
                    region,
                    city,
                    address,
                    email,
                    phoneNumber,
                    establishedYear
                })
            })
                
        return response.status;
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    },
    deleteFaculty:async(universityId, facultyId)=>{
        try{
                const response = await fetch(`${baseUrl}universities/${universityId}/faculties/${facultyId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

        return {status:response.status};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    },
    getFacultyByDeanId: async(deanId) => {
        try{
                const response = await fetch(`${baseUrl}deans/${deanId}/faculty`,)
                const data = await response.json();

                return {data,status:response.status};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    }
};
export default facultyApi;