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
        createNewTest: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/test/create`,
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
        fetchTestById : builder.mutation({
            query: (id) => ({
                url : `${USERS_URL}/test/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        startTest : builder.mutation({
            query: (id) => ({
                url: `${USERS_URL}/test/canstart/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        fetchAllResults : builder.mutation({
            query : () => ({
                url : `${USERS_URL}/test/user/results`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        viewTest: builder.mutation({
            query: (id) => ({
                url : `${USERS_URL}/test/results/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        getResultById : builder.mutation({
            query: (id) => ({
                url : `${USERS_URL}/test/result/${id}`,
                method: 'GET',
                credentials: 'include',
            })
        }),
        submitTest: builder.mutation({
            query: (data)=>({
                url: `${USERS_URL}/test/submit`,
                method:'POST',
                body: data,
                credentials : 'include',
            })
        })
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
    useCreateNewTestMutation,
    useFetchAllSubjectsMutation,
    useFetchTestBySubjectMutation,
    useFetchTestByIdMutation,
    useStartTestMutation,
    useFetchAllResultsMutation,
    useViewTestMutation,
    useSubmitTestMutation,
    useGetResultByIdMutation,
    // useUpdateUserMutation,
    // useFetchAllUsersMutation,
    // useFetchChatMessagesMutation,
    // useSendChatMessageMutation,
} = userApiSlice ;