import React from 'react';
import cx from 'classnames';
import { intlShape } from 'react-intl';
import RiskAction from '../RiskAction/risk_action';
import ASCVDRisk from '../../../app/load_fhir_data';
import styles from './simulated_risk.css';

class SimulatedRisk extends React.Component {
  constructor(props) {
    super(props);
    this.calculateBarSize = this.calculateBarSize.bind(this);
    this.calculateLabelPlace = this.calculateLabelPlace.bind(this);
    this.borderStyle = this.borderStyle.bind(this);
  }

  /**
   * Calculates the height(px) of each section on the simulated risk bar that
   * pertains to lowest possible risk, current risk, or a potential risk. This is
   * calculated using lowest possible risk, current, and potential risk scores.
   * @param risk - The type of risk to calculate a height for
   * @returns {{height: string}} - A CSS style that defines the height
   */
  calculateBarSize(risk) {
    const totalBarHeight = 472;
    // Solid orange bar
    const lowestRisk = Math.round(((totalBarHeight * this.props.scoreBest) /
        this.props.scoreCurrent) * 10) / 10;
    // White bar
    const potentialRisk = Math.round(((totalBarHeight * this.props.potentialRisk) /
        this.props.scoreCurrent) * 10) / 10;
    // Striped bar
    const currentRisk = Math.round((totalBarHeight - lowestRisk - potentialRisk) * 10) / 10;
    if (risk === 'current') {
      return ({
        height: `${currentRisk}px`,
      });
    } else if (risk === 'potential') {
      return ({
        height: `${potentialRisk}px`,
      });
    }
    if (this.props.scoreBest === 0 && this.props.scoreCurrent === 0) {
      return ({
        height: '472px',
      });
    }
    return ({
      height: `${lowestRisk}px`,
    });
  }

  /**
   * Calculates the height(px) of each label on the simulated risk bar
   * that pertains to lowest possible risk, current risk, or a potential risk. This is
   * calculated using lowest possible risk, current, and potential risk scores. This
   * account for hiding certain labels under text-overlap conflicting cases, as well
   * as pushing text up/down to avoid text-overlap.
   * @param risk - The type of risk to calculate a height for
   * @returns {*} - CSS styles that define a height, display, and padding properties
   */
  calculateLabelPlace(risk) {
    const totalBarHeight = 472;
    // Solid orange bar
    const lowestRisk = Math.round(((totalBarHeight * this.props.scoreBest) /
        this.props.scoreCurrent) * 10) / 10;
    // White bar
    const potentialRisk = Math.round(((totalBarHeight * this.props.potentialRisk) /
        this.props.scoreCurrent) * 10) / 10;
    // Striped bar
    const currentRisk = Math.round((totalBarHeight - lowestRisk - potentialRisk) * 10) / 10;

    /**
     * MIDDLE
     */
    if (risk === 'current') {
      // Mobile width
      if (this.props.width <= 700) {
        // 2 label collisions near the top of the bar
        // Move current risk label up, potential risk down
        if (potentialRisk < 24 && potentialRisk !== 0) {
          return ({
            height: `${currentRisk - 24}px`,
          });
        }

        // 2 label collisions in the middle of the bar
        // Move potential risk label up, lowest risk down
        if ((currentRisk <= 36 && currentRisk > 0) || lowestRisk >= 448) {
          if (lowestRisk >= 448) {
            return ({
              height: `${currentRisk}px`,
              paddingBottom: '12px',
            });
          }
          return ({
            height: `${currentRisk}px`,
            paddingBottom: '36px',
          });
        }
      }
      // 2 label collisions near the top of the bar
      // Move current risk label up, potential risk down
      if (potentialRisk < 24 && potentialRisk !== 0) {
        return ({
          height: `${currentRisk - 24}px`,
        });
      }

      // 2 label collisions in the middle of the bar
      // Move potential risk label up, lowest risk down
      if ((currentRisk <= 24 && currentRisk > 0) || lowestRisk >= 448) {
        return ({
          height: `${currentRisk}px`,
          paddingBottom: '12px',
        });
      }

      // 2 label collisions near the bottom of the bar
      // Move lowest risk label up, 0% label down
      if (lowestRisk < 18 && currentRisk > 12) {
        // 3 label collisions near the bottom of the bar
        // Remove the 0% label
        if (currentRisk < 36) {
          return ({
            height: `${currentRisk}px`,
            paddingBottom: '12px',
          });
        }
        return ({
          height: `${currentRisk - 12}px`,
        });
      }
      return ({
        height: `${currentRisk}px`,
      });
      /**
       * TOP
       */
    } else if (risk === 'potential') {
      // Mobile width
      if (this.props.width <= 700) {
        // 2 label collisions in the middle of the bar
        // Move potential risk label up, lowest risk down
        if (currentRisk <= 36 && currentRisk > 0) {
          if (lowestRisk + currentRisk > 412 && potentialRisk !== 0) {
            return ({
              height: `${potentialRisk - 36}px`,
              fontSize: '0px',
            });
          }
          if (!(lowestRisk > 448)) {
            return ({
              height: `${potentialRisk - 24}px`,
            });
          }
        }
      }

      // Edge Case: If lowest risk is as tall as current risk
      // Remove current risk label
      if (lowestRisk === totalBarHeight) {
        return ({
          display: 'none',
        });
      }

      // 2 label collisions in the middle of the bar
      // Move potential risk label up, lowest risk down
      if (potentialRisk < 24 && potentialRisk !== 0) {
        if (lowestRisk > 448) {
          return ({
            height: `${potentialRisk}px`,
            paddingBottom: '12px',
          });
        }
        return ({
          height: `${potentialRisk + 24}px`,
        });
      }

      if (currentRisk <= 24 && currentRisk > 0 && !(lowestRisk > 448)) {
        return ({
          height: `${potentialRisk - 12}px`,
        });
      }

      // 2 label collisions near the bottom of the bar
      // Move lowest risk label up, 0% label down
      if (lowestRisk < 18 && currentRisk === 0) {
        return ({
          height: `${potentialRisk - 12}px`,
        });
      }
      if (lowestRisk < 18 && currentRisk !== 0 && currentRisk > 12) {
        // 3 label collisions near the bottom of the bar
        // Remove the 0% label
        if (currentRisk < 36) {
          return ({
            height: `${potentialRisk + 12}px`,
          });
        }
      }
      if (this.props.scoreBest === 0 && this.props.scoreCurrent === 0) {
        return ({
          height: '472px',
        });
      }
      return ({
        height: `${potentialRisk}px`,
      });
      /**
       * BOTTOM
       */
    } else if (risk === 'lowest') {
      // Mobile width
      if (this.props.width <= 700) {
        // 2 label collisions near the top of the bar
        // Move current risk label up, potential risk down
        if (potentialRisk < 48 && potentialRisk !== 0) {
          // 3 label collisions near the top of the bar
          // Hide current risk label
          if (lowestRisk > 448) {
            return ({
              height: `${lowestRisk - 36}px`,
              paddingTop: '24px',
            });
          }
          if (currentRisk < 36) {
            return ({
              height: `${lowestRisk - 12}px`,
              paddingTop: '12px',
            });
          }
        }

        // 2 label collisions in the middle of the bar
        // Move potential risk label up, lowest risk down
        if (currentRisk <= 36 && currentRisk > 0) {
          if (lowestRisk > 448) {
            return ({
              height: `${lowestRisk - 36}px`,
              paddingTop: '24px',
            });
          }
          return ({
            height: `${lowestRisk - 12}px`,
          });
        }
      }

      // 2 label collisions near the top of the bar
      // Move current risk label up, potential risk down
      if (potentialRisk < 24 && potentialRisk !== 0) {
        // 3 label collisions near the top of the bar
        // Hide current risk label
        if (lowestRisk > 448) {
          return ({
            height: `${lowestRisk - 36}px`,
            paddingTop: '24px',
          });
        }
        if (currentRisk < 36) {
          return ({
            height: `${lowestRisk - 24}px`,
            paddingTop: '12px',
          });
        }
      }

      // 2 label collisions in the middle of the bar
      // Move potential risk label up, lowest risk down
      if (currentRisk <= 24 && currentRisk > 0) {
        if (lowestRisk > 448) {
          return ({
            height: `${lowestRisk - 36}px`,
            paddingTop: '24px',
          });
        }
        return ({
          paddingTop: '12px',
          height: `${lowestRisk - 12}px`,
        });
      }

      // 2 label collisions near the bottom of the bar
      // Move lowest risk label up, 0% label down
      if (lowestRisk < 18) {
        return ({
          paddingBottom: '6px',
        });
      }
      return ({
        height: `${lowestRisk}px`,
      });
      /**
       * 0%
       */
    } else if (risk === '0') {
      // Mobile width
      if (this.props.width <= 700) {
        // 2 label collisions in the middle of the bar
        // Move potential risk label up, lowest risk down
        if (currentRisk <= 36 && currentRisk > 0) {
          if (lowestRisk < 36) {
            return ({
              display: 'none',
            });
          }
        }
      }
      // 2 label collisions in the middle of the bar
      // Move potential risk label up, lowest risk down
      if (currentRisk <= 24 && currentRisk > 0) {
        // 3 label collisions near the bottom of the bar
        // Remove the 0% label
        if (lowestRisk < 30) {
          return ({
            display: 'none',
          });
        }
      }
    }

    return {};
  }

  /**
   * Checks to see if a label should be hidden
   * @param risk - The type of risk to check to potentially hide
   * @returns {*} - A CSS class that hides the div or shows it
   */
  hideLabel(risk) {
    // Get the pixel amounts of each risk bar
    const potentialTemp = this.calculateBarSize('potential');
    const potentialPx = Number(potentialTemp.height.substring(0, potentialTemp.height.length - 2));

    const lowestTemp = this.calculateBarSize('lowest');
    const lowestPx = Number(lowestTemp.height.substring(0, lowestTemp.height.length - 2));

    const currentTemp = this.calculateBarSize('current');
    const currentPx = Number(currentTemp.height.substring(0, currentTemp.height.length - 2));

    /**
     * Hide potential (striped bar) risk label if :
     * 1. There is no potential risk
     * 2. The bar is at the lowest possible risk bar
     * 3. The bar is at the current risk label (top)
     */
    if (risk === 'potential') {
      if (this.props.potentialRisk === 0) {
        return styles.hidden;
      }

      if (currentPx <= 24 && currentPx > 0 && lowestPx > 448) {
        return styles.remove;
      }

      if (currentPx === 0) {
        return styles.remove;
      }
    }
    /**
     * Hide current (white bar) risk label if :
     * 1. Lowest possible risk and potential risk scores would
     *    have text overlap with this label
     */
    if (risk === 'current') {
      if ((potentialPx + lowestPx) > 448) {
        return styles.hidden;
      }
    }

    /**
     * Hide 0% label if:
     * 1. Potential and lowest risk labels would collide
     * 2. Lowest possible risk score is 0%
     * 3. In the mobile width view, lowest possible risk label is less than 48 px
     *    (or bottom of lowest possible risk label is at bottom of risk bar)
     */
    if (risk === '0') {
      // Mobile width
      if (this.props.width <= 700) {
        if (lowestPx < 56 && currentPx !== 0 && currentPx > 12) {
          return styles.remove;
        }
        if (lowestPx <= 48) {
          return styles.remove;
        }
      }
      if (lowestPx < 18 && currentPx !== 0 && currentPx > 12) {
        if (currentPx < 36) {
          return styles.remove;
        }
      }
      if (lowestPx === 0) {
        return styles.remove;
      }
      if (this.props.scoreBest === 0 && this.props.scoreCurrent === 0) {
        return styles.remove;
      }
    }

    return styles.show;
  }

  /**
   * Check to see which border style to apply on the simulated risk bar.
   * If the white bar fills 100% of the simulated risk bar, a full border
   * will be applied to the bar. A partial border will be used otherwise.
   * @returns {*} - A CSS class that specifies the border style
   */
  borderStyle() {
    const totalBarHeight = 472;
    const potentialRisk = Math.round(((totalBarHeight * this.props.potentialRisk) /
        this.props.scoreCurrent) * 10) / 10;
    if (potentialRisk === totalBarHeight) {
      return styles['full-border'];
    }
    return styles['partial-border'];
  }

  render() {
    const propIntl = this.props.intl;
    const messages = propIntl.messages;
    return (
      <div className={styles.container}>
        <div className={styles.title}>{this.props.title}</div>
        <div className={styles.left}>
          <div className={styles['float-right']}>
            <div className={styles['bar-labels']}>
              <div style={this.calculateLabelPlace('potential')}>
                {propIntl.formatMessage(messages.graphCurrentRiskLabel)}
                <br />
                {propIntl.formatNumber(this.props.scoreCurrent)}%
              </div>
              <div
                className={this.hideLabel('potential')}
                style={this.calculateLabelPlace('current')}
              >
                {propIntl.formatMessage(messages.graphPotentialRiskLabel)}
                <br />
                {propIntl.formatNumber(Math.round((this.props.scoreCurrent -
                    this.props.potentialRisk) * 10) / 10)}%
              </div>
              <div
                className={this.hideLabel('lowest')}
                style={this.calculateLabelPlace('lowest')}
              >
                {propIntl.formatMessage(messages.graphLowestPossibleRiskLabel)}
                <br />
                {propIntl.formatNumber(this.props.scoreBest)}%
              </div>
              <div
                className={cx(styles['last-increment'], this.hideLabel('0'))}
                style={this.calculateLabelPlace('0')}
              >0%
              </div>
            </div>
            <div className={styles['bar-total']}>
              <div className={this.borderStyle()}>
                <div
                  className={styles['bar-potential-risk']}
                  style={this.calculateBarSize('potential')}
                />
                <div
                  className={styles['bar-current-risk']}
                  style={this.calculateBarSize('current')}
                />
              </div>
              <div
                className={styles['bar-lowest-risk']}
                style={this.calculateBarSize('lowest')}
              />
            </div>
          </div>
        </div>
        <div className={styles['page-break']} />
        <div className={styles.right}>
          <RiskAction
            prompt={propIntl.formatMessage(messages.simulatedRiskPrompt)}
            isSmoker={ASCVDRisk.patientInfo.relatedFactors.smoker}
            controlSysBP={ASCVDRisk.patientInfo.systolicBloodPressure > 140}
            riskActionLabel1={propIntl.formatMessage(messages.simulatedStatin)}
            riskActionLabel2={propIntl.formatMessage(messages.simulatedSysBP)}
            riskActionLabel3={propIntl.formatMessage(messages.simulatedAspirin)}
            riskActionLabel4={propIntl.formatMessage(messages.simulatedSmoking)}
            addOption={this.props.addOption}
            removeOption={this.props.removeOption}
            options={this.props.options}
          />
        </div>
      </div>
    );
  }
}
SimulatedRisk.propTypes = {
  scoreBest: React.PropTypes.number.isRequired,
  scoreCurrent: React.PropTypes.number.isRequired,
  potentialRisk: React.PropTypes.number.isRequired,
  addOption: React.PropTypes.func.isRequired,
  removeOption: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  width: React.PropTypes.number,
  intl: intlShape,
};

export default SimulatedRisk;
