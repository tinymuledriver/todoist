import React from 'react';
import moment from 'moment';
import { FaSpaceShuttle, FaSun, FaRegPaperPlane } from 'react-icons/fa';
import PropTypes from 'prop-types';

const DATE_BUTTONS = [
  {
    id: 'today',
    label: 'Today',
    icon: FaSpaceShuttle,
    testId: 'task-date-today',
    ariaLabel: 'Select today as the task date',
    getDate: () => moment().format('DD/MM/YYYY'),
  },
  {
    id: 'tomorrow',
    label: 'Tomorrow',
    icon: FaSun,
    testId: 'task-date-tomorrow',
    ariaLabel: 'Select tomorrow as the task date',
    getDate: () => moment().add(1, 'day').format('DD/MM/YYYY'),
  },
  {
    id: 'next-week',
    label: 'Next week',
    icon: FaRegPaperPlane,
    testId: 'task-date-next-week',
    ariaLabel: 'Select next week as the task date',
    getDate: () => moment().add(7, 'days').format('DD/MM/YYYY'),
  },
];

const DateButton = ({ button, setTaskDate, setShowTaskDate }) => {
  const Icon = button.icon;

  const handleSelect = () => {
    setShowTaskDate(false);
    setTaskDate(button.getDate());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSelect();
    }
  };

  return (
    <li>
      <div
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        data-testid={button.testId}
        tabIndex={0}
        aria-label={button.ariaLabel}
        role="button"
      >
        <span>
          <Icon />
        </span>
        <span>{button.label}</span>
      </div>
    </li>
  );
};

DateButton.propTypes = {
  button: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    testId: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    getDate: PropTypes.func.isRequired,
  }).isRequired,
  setTaskDate: PropTypes.func.isRequired,
  setShowTaskDate: PropTypes.func.isRequired,
};

export const TaskDate = ({ setTaskDate, showTaskDate, setShowTaskDate }) =>
  showTaskDate && (
    <div className="task-date" data-testid="task-date-overlay">
      <ul className="task-date__list">
        {DATE_BUTTONS.map((button) => (
          <DateButton
            key={button.id}
            button={button}
            setTaskDate={setTaskDate}
            setShowTaskDate={setShowTaskDate}
          />
        ))}
      </ul>
    </div>
  );

TaskDate.propTypes = {
  setTaskDate: PropTypes.func.isRequired,
  showTaskDate: PropTypes.bool.isRequired,
  setShowTaskDate: PropTypes.func.isRequired,
};
