import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    allTests: {},
    subjects : [],
    questions: [],
    results: {},
    selectedSubject : null,
    selectedTest : null
}
const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        allSubjects: ( state, action )=>{
            state.subjects = Array.from( new Set( action.payload.map( test=> test.subject )));
        },
        setSelectedSubject : ( state , action ) => {
            state.selectedSubject = action.payload;
        },
        setSelectedTest : ( state , action ) => {
            state.selectedTest = action.payload;
        },
    }
})

export const { allSubjects, setSelectedSubject, setSelectedTest } = testSlice.actions;
export const testSliceReducer = testSlice.reducer;