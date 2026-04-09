import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { debounce } from "lodash";
import * as Yup from "yup";
import { getAllUser } from "../../../services/apis/api";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useUser } from "../../../contexts/users/UserContext";
import { useAuth } from "../../../contexts/authentication/AuthContext";
import usePagination from "../../../hooks/usePagination";

const validationSchema = Yup.object({
    new_password: Yup.string().min(6, "Ít nhất 6 ký tự").required("Bắt buộc"),
    role: Yup.string().required("Bắt buộc"),
});

const validationSchemaAccount = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    password: Yup.string().min(6, "Ít nhất 6 ký tự").required("Bắt buộc"),
    repassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Không khớp")
        .required("Bắt buộc"),
});

const UserRoleListPage = ({ role, title, addLabel, optionLabel }) => {
    const { handleUpdateAccount, handleDeleteAccount } = useUser();
    const { handleRegister } = useAuth();

    const [users, setUsers] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");
    const [debouncedEmail, setDebouncedEmail] = useState("");

    const [activeEditModalId, setActiveEditModalId] = useState(null);
    const [activeDeleteModalId, setActiveDeleteModalId] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const editModalRef = useRef(null);
    const deleteModalRef = useRef(null);
    const createModalRef = useRef(null);
    const dropdownRef = useRef(null);

    const fetchAllUser = useCallback(async () => {
        try {
            const allUsers = await getAllUser();
            setUsers(allUsers.filter((u) => u.user_type === role));
        } catch (error) {
            console.error(error);
        }
    }, [role]);

    useEffect(() => {
        fetchAllUser();
    }, [fetchAllUser]);

    useEffect(() => {
        const handler = debounce(() => setDebouncedEmail(searchEmail), 300);
        handler();
        return () => handler.cancel();
    }, [searchEmail]);

    const filteredUsers = useMemo(() => users.filter((u) => u.email.toLowerCase().includes(debouncedEmail.toLowerCase())), [users, debouncedEmail]);

    const { currentPage, totalPages, currentItems, itemsPerPage, handlePageChange } = usePagination(users, filteredUsers);

    useEffect(() => {
        const handleClickOutsideDropdown = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
    }, []);

    useEffect(() => {
        const handleClickOutsideModal = (event) => {
            if (activeEditModalId && editModalRef.current && !editModalRef.current.contains(event.target)) {
                setActiveEditModalId(null);
            }
            if (activeDeleteModalId && deleteModalRef.current && !deleteModalRef.current.contains(event.target)) {
                setActiveDeleteModalId(null);
            }
            if (isCreateModalOpen && createModalRef.current && !createModalRef.current.contains(event.target)) {
                setIsCreateModalOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideModal);
        return () => document.removeEventListener("mousedown", handleClickOutsideModal);
    }, [activeEditModalId, activeDeleteModalId, isCreateModalOpen]);

    return (
        <>
            <div className="layout-top">
                <h1 className="headline-1">{title}</h1>
                <button className="c-button-1" onClick={() => setIsCreateModalOpen(true)}>
                    <i className="fa-regular fa-square-plus" /> {addLabel}
                </button>
            </div>

            <div className="layout-box">
                <div className="layout-filter">
                    <div className="form-group">
                        <i className="fa-solid fa-magnifying-glass" />
                        <input type="text" className="c_input" placeholder="Tìm tài khoản..." value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
                    </div>
                    <div className="pagination">
                        <div className="pagination_number">
                            <span>{currentPage}</span>/<span>{totalPages}</span>
                        </div>
                        <div className="pagination_arrow">
                            <span className={currentPage === 1 ? "disable" : ""} onClick={() => handlePageChange("prev")}>
                                <i className="fa fa-angle-left" />
                            </span>
                            <span className={currentPage === totalPages ? "disable" : ""} onClick={() => handlePageChange("next")}>
                                <i className="fa fa-angle-right" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="layout-box">
                <div className="table-container">
                    <table className="table-1">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tài khoản</th>
                                <th>Quyền</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5">Không tìm thấy tài khoản nào phù hợp.</td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => {
                                    const userId = item._id || item.id;

                                    return (
                                        <tr key={`${userId ?? "user"}-${index}`}>
                                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td>{item.email}</td>
                                            <td style={{ textTransform: "capitalize" }}>{item.user_type}</td>
                                            <td>
                                                <div className={`tag-${item.is_online === 1 ? "on" : "off"}`}>{item.is_online === 1 ? "Online" : "Offline"}</div>
                                            </td>
                                            <td>
                                                <div className={`dropdown_account ${activeDropdown === userId ? "active" : ""}`} ref={activeDropdown === userId ? dropdownRef : null}>
                                                    <span onClick={() => setActiveDropdown(activeDropdown === userId ? null : userId)}>
                                                        <i className="fa fa-ellipsis-h" />
                                                    </span>
                                                    <ul>
                                                        <li>
                                                            <Link to="#" onClick={() => setActiveEditModalId(userId)}>
                                                                <i className="fa-regular fa-pen-to-square" /> Chỉnh sửa
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="#" onClick={() => setActiveDeleteModalId(userId)}>
                                                                <i className="fa fa-trash" /> Xoá
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={`modal ${activeEditModalId ? "active" : ""}`}>
                {activeEditModalId && (
                    <div className="modal_box" ref={editModalRef}>
                        <div className="modal-close" onClick={() => setActiveEditModalId(null)}>
                            <i className="fa-solid fa-xmark" />
                        </div>
                        <Formik
                            enableReinitialize
                            initialValues={{
                                email: users.find((u) => (u._id || u.id) === activeEditModalId)?.email || "",
                                new_password: "",
                                role: users.find((u) => (u._id || u.id) === activeEditModalId)?.user_type || role,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values) =>
                                handleUpdateAccount(values, () => {
                                    fetchAllUser();
                                    setActiveEditModalId(null);
                                })
                            }
                        >
                            <Form>
                                <div>
                                    <label>Email</label>
                                    <Field type="text" name="email" readOnly />
                                </div>
                                <div>
                                    <label>Password</label>
                                    <Field type="password" name="new_password" />
                                    <ErrorMessage name="new_password" component="div" className="err" />
                                </div>
                                <div>
                                    <label>Role</label>
                                    <Field as="select" name="role" disabled>
                                        <option value={role}>{optionLabel}</option>
                                    </Field>
                                    <ErrorMessage name="role" component="div" className="err" />
                                </div>
                                <button type="submit">
                                    <i className="fa-solid fa-floppy-disk" /> Save
                                </button>
                            </Form>
                        </Formik>
                    </div>
                )}
            </div>

            <div className={`modal ${activeDeleteModalId ? "active" : ""}`}>
                {activeDeleteModalId && (
                    <div className="modal_box" ref={deleteModalRef}>
                        <div className="confirm_infor">
                            <i className="fa fa-trash" />
                            <h3>Bạn chắc chắn?</h3>
                        </div>
                        <div className="confirm_button">
                            <button className="out-button" onClick={() => setActiveDeleteModalId(null)}>
                                Thoát
                            </button>
                            <button
                                className="delete-button"
                                onClick={() =>
                                    handleDeleteAccount(activeDeleteModalId, () => {
                                        fetchAllUser();
                                        setActiveDeleteModalId(null);
                                    })
                                }
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className={`modal ${isCreateModalOpen ? "active" : ""}`} ref={createModalRef}>
                {isCreateModalOpen && (
                    <div className="modal_box">
                        <div className="modal-close" onClick={() => setIsCreateModalOpen(false)}>
                            <i className="fa-solid fa-xmark" />
                        </div>
                        <Formik
                            initialValues={{ email: "", password: "", repassword: "" }}
                            validationSchema={validationSchemaAccount}
                            onSubmit={(values, { resetForm }) =>
                                handleRegister({ ...values, user_type: role }, () => {
                                    resetForm();
                                    fetchAllUser();
                                    setIsCreateModalOpen(false);
                                })
                            }
                        >
                            <Form>
                                <div>
                                    <label>Email</label>
                                    <Field type="email" name="email" />
                                    <ErrorMessage name="email" component="div" className="err" />
                                </div>
                                <div>
                                    <label>Password</label>
                                    <Field type="password" name="password" />
                                    <ErrorMessage name="password" component="div" className="err" />
                                </div>
                                <div>
                                    <label>Re-Password</label>
                                    <Field type="password" name="repassword" />
                                    <ErrorMessage name="repassword" component="div" className="err" />
                                </div>
                                <button type="submit">Create Account</button>
                            </Form>
                        </Formik>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserRoleListPage;
