import React from 'react';
import moment from 'moment';
import { FaSpaceShuttle, FaSun, FaRegPaperPlane } from 'react-icons/fa';
import PropTypes from 'prop-types';

const DateButton = ({ icon: Icon, label, testId, ariaLabel, onSelect }) => {
  const handleClick = () => {
    onSelect();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSelect();
    }
  };

  return (
    <li>
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-testid={testId}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
      >
        <span>
          <Icon />
        </span>
        <span>{label}</span>
      </div>
    </li>
  );
};

DateButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const DATE_BUTTONS = [
  {
    icon: FaSpaceShuttle,
    label: 'Today',
    testId: 'task-date-today',
    ariaLabel: 'Select today as the task date',
    getDaysOffset: () => 0,
  },
  {
    icon: FaSun,
    label: 'Tomorrow',
    testId: 'task-date-tomorrow',
    ariaLabel: 'Select tomorrow as the task date',
    getDaysOffset: () => 1,
  },
  {
    icon: FaRegPaperPlane,
    label: 'Next week',
    testId: 'task-date-next-week',
    ariaLabel: 'Select next week as the task date',
    getDaysOffset: () => 7,
  },
];

export const TaskDate = ({ setTaskDate, showTaskDate, setShowTaskDate }) => {
  const handleDateSelect = (daysOffset) => {
    setShowTaskDate(false);
    const selectedDate = moment().add(daysOffset, 'days').format('DD/MM/YYYY');
    setTaskDate(selectedDate);
  };

  return (
    showTaskDate && (
      <div className="task-date" data-testid="task-date-overlay">
        <ul className="task-date__list">
          {DATE_BUTTONS.map((button) => (
            <DateButton
              key={button.testId}
              icon={button.icon}
              label={button.label}
              testId={button.testId}
              ariaLabel={button.ariaLabel}
              onSelect={() => handleDateSelect(button.getDaysOffset())}
            />
          ))}
        </ul>
      </div>
    )
  );
};

TaskDate.propTypes = {
  setTaskDate: PropTypes.func.isRequired,
  showTaskDate: PropTypes.bool.isRequired,
  setShowTaskDate: PropTypes.func.isRequired,
};
