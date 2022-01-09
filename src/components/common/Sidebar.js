import { useContext } from 'react';
import { useHistory } from 'react-router';

import Context from '../../context';

function Sidebar() {
  const { id, items, setId } = useContext(Context);

  const history = useHistory();

  const chooseItem = (id, route) => () => {
    setId(() => id);
    navigate(route);
  };

  const navigate = route => {
    history.push(route);
  };

  return (
    <div className="sidebar__container">
      {items.map(item => (
        <div key={item.id} className={`sidebar__item ${id === item.id ? 'side__item--active' : ''}`} onClick={chooseItem(item.id, item.route)}>
          <div className="sidebar__item-icon">{item.icon}</div>
          <span className="sidebar__item-name">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;