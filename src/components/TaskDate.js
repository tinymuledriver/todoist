import React from 'react';
import moment from 'moment';
import { FaSpaceShuttle, FaSun, FaRegPaperPlane } from 'react-icons/fa';
import PropTypes from 'prop-types';

const DATE_BUTTONS = [
  {
    id: 'today',
    label: 'Today',
    icon: FaSpaceShuttle,
    daysOffset: 0,
    testId: 'task-date-today',
    ariaLabel: 'Select today as the task date',
  },
  {
    id: 'tomorrow',
    label: 'Tomorrow',
    icon: FaSun,
    daysOffset: 1,
    testId: 'task-date-tomorrow',
    ariaLabel: 'Select tomorrow as the task date',
  },
  {
    id: 'next-week',
    label: 'Next week',
    icon: FaRegPaperPlane,
    daysOffset: 7,
    testId: 'task-date-next-week',
    ariaLabel: 'Select next week as the task date',
  },
];

const DateButton = ({ config, setShowTaskDate, setTaskDate }) => {
  const Icon = config.icon;
  const handleDateSelect = () => {
    setShowTaskDate(false);
    setTaskDate(moment().add(config.daysOffset, 'day').format('DD/MM/YYYY'));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleDateSelect();
    }
  };

  return (
    <li>
      <div
        onClick={handleDateSelect}
        onKeyDown={handleKeyDown}
        data-testid={config.testId}
        tabIndex={0}
        aria-label={config.ariaLabel}
        role="button"
      >
        <span>
          <Icon />
        </span>
        <span>{config.label}</span>
      </div>
    </li>
  );
};

DateButton.propTypes = {
  config: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    daysOffset: PropTypes.number.isRequired,
    testId: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string.isRequired,
  }).isRequired,
  setShowTaskDate: PropTypes.func.isRequired,
  setTaskDate: PropTypes.func.isRequired,
};

export const TaskDate = ({ setTaskDate, showTaskDate, setShowTaskDate }) =>
  showTaskDate && (
    <div className="task-date" data-testid="task-date-overlay">
      <ul className="task-date__list">
        {DATE_BUTTONS.map((config) => (
          <DateButton
            key={config.id}
            config={config}
            setShowTaskDate={setShowTaskDate}
            setTaskDate={setTaskDate}
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
