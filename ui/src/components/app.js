import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/css/bootstrap-theme.min.css');

const starmap = require('./starmap.png');

class App extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col md={6}>
            Stats go here....
          </Col>
          <Col md={6}>
            <img src={starmap} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
