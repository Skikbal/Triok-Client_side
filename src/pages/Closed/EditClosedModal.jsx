import React, { useState } from 'react'
import AddClosedData from './components/AddClosedData'
import useAuth from '../../hooks/useAuth';
import Modal from "../../components/Modal/Modal";
import Loader from "../../components/Loader";


const initialData = {};
const EditClosedModal = ({ showModal, onClose, onCallApi, id }) => {
    const [config] = useAuth();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialData);


    const handleClose = () => {
        setFormData(initialData);
        onClose();
    };
    return (
        <Modal title={`Edit Closed`} desc={`Edit the Closed information.`} show={showModal} onClose={onClose}>
            {loading ? (
                <Loader />
            ) : (
                <AddClosedData
                    formData={formData}
                    error={error}
                    // onSetFormData={(value) => {
                    //   setFormData(value);
                    // }}
                    onSetError={(value) => setError(value)}
                    // handleSubmit={handleSubmit}
                    handleClose={handleClose}
                    showModal={showModal}
                />
            )}
        </Modal>
    )
}

export default EditClosedModal