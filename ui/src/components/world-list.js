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
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
      {props.worlds.map((w) => (
      <tr key={w.coords} onClick={onSelectWorld(w)}>
          <td>{w.coords}</td>
          <td>{w.name}</td>
          <td>{w.uwp}</td>
          <td>{w.short_trade_codes}</td>
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
