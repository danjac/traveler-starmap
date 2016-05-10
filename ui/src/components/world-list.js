import React, { PropTypes } from 'react';

const WorldList = (props) => {
  const onSelectWorld = world => () => {
    props.onSelectWorld(world);
  };

  return (
    <table className="table table-striped table-condensed table-hover">
      <thead>
        <tr>
          <th>Coords</th>
          <th>Name</th>
          <th>UWP</th>
          <th>Trade</th>
          <th>Bases</th>
          <th>Travel zone</th>
        </tr>
      </thead>
      <tbody>
      {props.worlds.map((w) => (
      <tr key={w.coords} onClick={onSelectWorld(w)}>
          <td>{w.coords}</td>
          <td>{w.name}</td>
          <td>{w.uwp}</td>
          <td>{w.short_trade_codes}</td>
          <td>{w.base_codes}</td>
          <td>{w.travel_zone}</td>
        </tr>
        ))}
      </tbody>
    </table>
  );
};

WorldList.propTypes = {
  onSelectWorld: PropTypes.func.isRequired,
  worlds: PropTypes.array.isRequired,
};

export default WorldList;
