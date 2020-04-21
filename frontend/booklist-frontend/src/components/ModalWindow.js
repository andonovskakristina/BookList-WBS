import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


const ModalWindow = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    var btnOkClick = () => {
        handleClose();
        props.onDelete();
    };

    return (
        <>
            {props.title ?
                <button className="btn btn-sm btn-outline-secondary mx-1"
                        onClick={handleShow}
                        title={"Delete Book"}>
                    <span className="fa fa-remove"/>
                </button>
                :
                <button className="btn btn-sm btn-secondary m-1"
                        onClick={handleShow}
                        title={"Delete Author"}>
                <span className="fa fa-remove"/>
                </button>
            }

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete {props.title ? props.title : props.name}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={btnOkClick}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalWindow