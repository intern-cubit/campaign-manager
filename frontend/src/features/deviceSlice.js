import { createSlice } from "@reduxjs/toolkit";

const deviceSlice = createSlice({
    name: "device",
    initialState: {
        selectedDevice: null,
        selectedMac: null,
        devices: [],
        loading: false,
        error: null,
    },
    reducers: {
        addDeviceStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        addDeviceSuccess: (state, action) => {
            state.loading = false;
            state.devices.push(action.payload);
        },
        addDeviceFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchDevicesStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchDevicesSuccess: (state, action) => {
            state.loading = false;
            state.devices = action.payload;
        },
        fetchDevicesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setSelectedDevice: (state, action) => {
            state.selectedDevice = action.payload;
        },
        setSelectedMac: (state, action) => {
            state.selectedMac = action.payload;
        },
    },
});

export const {
    addDeviceStart,
    addDeviceSuccess,
    addDeviceFailure,
    fetchDevicesStart,
    fetchDevicesSuccess,
    fetchDevicesFailure,
    setSelectedDevice,
    setSelectedMac,
} = deviceSlice.actions;

export default deviceSlice.reducer;