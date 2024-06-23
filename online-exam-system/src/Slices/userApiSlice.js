import { apiSlice } from "./apiSlice";
const USERS_URL = '';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth/login`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        logout: builder.mutation ({
            query: ()=>({
                url: `${USERS_URL}/auth/logout`,
                method: 'POST',
                credentials: 'include',
            }),
        }),
        register: builder.mutation({
            query: (data)=>({
                url: `${USERS_URL}/auth/register`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        fetchAllSubjects: builder.mutation({
            query: ()=>({
                url : `${USERS_URL}/test`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        fetchTestBySubject : builder.mutation({
            query: (subject)=> ({
                url: `${USERS_URL}/test/subject/${subject}`,
                method: 'GET',
                credentials: 'include'
            }),
        }),
        // updateUser: builder.mutation({
        //     query: (data)=>({
        //         url: `${USERS_URL}/users/profile`,
        //         method: 'PUT',
        //         body: data,
        //         credentials: 'include',
        //     }),
        // }),
        // fetchAllUsers : builder.mutation({ 
        //     query: () => ({
        //         url : `${USERS_URL}/allusers`,
        //         method: 'GET',
        //         credentials: 'include',
        //     }),
        // }),
        // fetchChatMessages: builder.mutation({
            
        //     query: (chatSelected) => ({
        //         url: `${USERS_URL}/messages/${chatSelected._id}`,
        //         method: 'GET',
        //         credentials: 'include'
        //     }),
        // }),
        // sendChatMessage: builder.mutation({
        //     query: ( { add , message })=> (
        //         {
        //         url: `${USERS_URL}/messages/send/${add}`,
        //         method: 'POST',
        //         body: message,
        //         credentials: 'include'
        //     }),
        // }),
    }),
});

export const {  
    useLoginMutation, 
    useLogoutMutation,
    useRegisterMutation,
    useFetchAllSubjectsMutation,
    useFetchTestBySubjectMutation,
    // useUpdateUserMutation,
    // useFetchAllUsersMutation,
    // useFetchChatMessagesMutation,
    // useSendChatMessageMutation,
} = userApiSlice ;