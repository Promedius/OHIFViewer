import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import getGridWidthClass from '../../utils/getGridWidthClass';
import Icon from '../Icon';

const StudyListTableRow = props => {
  const { tableData, onCheckboxChange } = props;
  const { row, expandedContent, onClickRow, isExpanded, dataCY } = tableData;
  const [isChecked, setChecked] = useState(false);

  // This function handles the change event of a checkbox.
  // It updates the state with the checked value and calls the onCheckboxChange function.
  const handleCheckboxChange = event => {
    const checked = event.target.checked;
    setChecked(checked);
    onCheckboxChange(checked, dataCY);
  };

  return (
    <>
      <tr
        data-cy={dataCY}
        className={classnames(
          'select-none',
          'hover:bg-secondary-main cursor-pointer transition duration-300',
          {
            'bg-primary-dark': !isExpanded,
          },
          { 'bg-secondary-dark': isExpanded }
        )}
      >
        <td
          className={classnames('border-0 p-0', {
            'border-secondary-light border-b': !isExpanded,
          })}
        >
          <input
            type="checkbox"
            // This checkbox will trigger the handleCheckboxChange function when its value changes
            onChange={handleCheckboxChange}
          ></input>
        </td>
        <td
          className={classnames('border-0 p-0', {
            'border-secondary-light bg-primary-dark border-b': isExpanded,
          })}
        >
          <div
            className={classnames(
              'w-full transition duration-300',
              {
                'border-primary-light hover:border-secondary-light mb-2 overflow-hidden rounded border':
                  isExpanded,
              },
              {
                'border-transparent': !isExpanded,
              }
            )}
          >
            <table className={classnames('w-full p-4')}>
              <tbody>
                <tr
                  className={classnames(
                    'hover:bg-secondary-main cursor-pointer transition duration-300',
                    {
                      'bg-primary-dark': !isExpanded,
                    },
                    { 'bg-secondary-dark': isExpanded }
                  )}
                  onClick={onClickRow}
                >
                  {row.map((cell, index) => {
                    const { content, title, gridCol } = cell;
                    return (
                      <td
                        key={index}
                        className={classnames(
                          'truncate px-4 py-2 text-base',
                          { 'border-secondary-light border-b': !isExpanded },
                          getGridWidthClass(gridCol) || ''
                        )}
                        style={{
                          maxWidth: 0,
                        }}
                        title={title}
                      >
                        <div className="flex space-x-4">
                          {index === 0 && <div></div>}
                          <div
                            className={classnames({ 'overflow-hidden': true }, { truncate: true })}
                          >
                            {content}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
                {isExpanded && (
                  <tr className="max-h-0 w-full select-text overflow-hidden bg-black">
                    <td colSpan={row.length}>{expandedContent}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  );
};

StudyListTableRow.propTypes = {
  tableData: PropTypes.shape({
    /** A table row represented by an array of "cell" objects */
    row: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        /** Optional content to render in row's cell */
        content: PropTypes.node,
        /** Title attribute to use for provided content */
        title: PropTypes.string,
        gridCol: PropTypes.number.isRequired,
      })
    ).isRequired,
    expandedContent: PropTypes.node.isRequired,
    onClickRow: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    dataCY: PropTypes.string,
  }),
  onCheckboxChange: PropTypes.func.isRequired,
};

export default StudyListTableRow;
