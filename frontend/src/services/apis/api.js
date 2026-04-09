import axios from "../../utils/axios.customize";

/* =========================================================
   🔐 AUTH APIs
========================================================= */

// Đăng ký
export const registerUser = async (data) => {
    const response = await axios.post(`/auth/register`, data);
    return response.data;
};

// Đăng nhập
export const loginUser = async (data) => {
    const response = await axios.post(`/auth/login`, data);
    return response.data;
};

// Yêu cầu reset password
export const requestPasswordReset = async (data) => {
    const response = await axios.post(`/auth/forgot-password`, data);
    return response.data;
};

// Reset password
export const resetPassword = async (data) => {
    const response = await axios.post(`/auth/reset-password`, data);
    return response.data;
};

// Cập nhật profile lần đầu (complete profile)
export const updateProfile = async (data) => {
    const response = await axios.put(`/auth/complete-profile`, data);
    return response.data;
};

// Logout
export const logoutUser = async () => {
    const response = await axios.post(`/auth/logout`);
    return response.data;
};

// Heartbeat (giữ trạng thái online)
export const heartbeatUser = async (userId) => {
    const response = await axios.post(`/auth/heartbeat`, { userId });
    return response.data;
};

/* =========================================================
   👤 USER APIs
========================================================= */

// Lấy tất cả user
export const getAllUser = async () => {
    const response = await axios.get(`/users/all`);
    return response.data;
};

// Update account (admin / general)
export const updateAccount = async (data) => {
    const response = await axios.put(`/users/update`, data);
    return response.data;
};

// Update account detail (profile cá nhân)
export const updateAccountDetail = async (data) => {
    const response = await axios.put(`/users/account`, data);
    return response.data;
};

// Lấy user theo role (teacher, student, ...)
export const getAllUserByRole = async (role) => {
    const response = await axios.get(`/users/role/${role}`);
    return response.data;
};

// Xoá user
export const deleteAccount = async (id) => {
    try {
        const response = await axios.delete(`/users/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
