import {Icon} from '@blueprintjs/core';
import React, {useState} from 'react';
import {Button, Offcanvas} from 'react-bootstrap';
import './offcanvas.css';

function Panel(props: {body: JSX.Element}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button id="launchPanelButton" variant="secondary" onClick={handleShow}>
        <Icon icon="drawer-left" />
      </Button>

      <Offcanvas show={show} onHide={handleClose} id="panel">
        <Offcanvas.Header
          closeButton
          style={{color: 'white', backgroundColor: 'var(--darkgray)'}}
        >
          <Offcanvas.Title>RAM MACHINE</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{props.body}</Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Panel;
