import React, { PropTypes } from 'react';
import * as bs from 'react-bootstrap';

const WorldDetail = props => {
  const { world } = props;

  const header = <h3>{world.name}</h3>;

  return (
    <bs.Panel header={header}>
      <dl className="dl-horizontal">
        <dt>Coordinates</dt>
        <dd>{world.coords}</dd>
        <dt>UWP</dt>
        <dd>{world.uwp}</dd>
        <dt>Travel code</dt>
        <dd>{world.travelZone}</dd>
        <dt>Starport</dt>
        <dd>{world.starport}</dd>
        <dt>Size</dt>
        <dd>{world.size}</dd>
        <dt>Atmosphere</dt>
        <dd>{world.atmosphere}</dd>
        <dt>Hydrographics</dt>
        <dd>{world.hydrographics}</dd>
        <dt>Temperature</dt>
        <dd>{world.temperature}</dd>
        <dt>Population</dt>
        <dd>{world.population}</dd>
        <dt>Government</dt>
        <dd>{world.government}</dd>
        <dt>Law level</dt>
        <dd>{world.lawLevel}</dd>
        <dt>Tech level</dt>
        <dd>{world.techLevel}</dd>
        <dt>Notes</dt>
        <dd>{world.longTradeCodes}</dd>
      </dl>
      <h4>Bases and facilities</h4>
      <table className="table table-condensed table-striped">
        <tbody>
          <tr><td>Gas giants</td>
          <td><input type="radio" readOnly checked={world.isGasGiant} /></td></tr>
          <tr><td>Naval base</td>
          <td><input type="radio" readOnly checked={world.isNavalBase} /></td></tr>
          <tr><td>Scout base</td>
          <td><input type="radio" readOnly checked={world.isScoutBase} /></td></tr>
          <tr><td>Research base</td>
          <td><input type="radio" readOnly checked={world.isResearchBase} /></td></tr>
          <tr><td>Pirate base</td>
          <td><input type="radio" readOnly checked={world.isPirateBase} /></td></tr>
          <tr><td>Traveler's Aid Society</td>
          <td><input type="radio" readOnly checked={world.isTas} /></td></tr>
          <tr><td>Imperial Consulate</td>
          <td><input type="radio" readOnly checked={world.isConsulate} /></td></tr>
        </tbody>
      </table>
    </bs.Panel>
  );
};

WorldDetail.propTypes = {
  world: PropTypes.object.isRequired,
};


export default WorldDetail;
