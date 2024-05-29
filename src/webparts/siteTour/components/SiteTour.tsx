import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import styles from './SiteTour.module.scss';
import { SiteTourService, ISiteTourService } from '../services/SiteTourService';
import { AppInsightsService, IAppInsightsService } from './../../../common/AppInsightsService';
import { ITourItem, ISteps } from './ITourItem';
import type { ISiteTourProps } from './ISiteTourProps';
import type { ISiteTourState } from './ISiteTourState';
import * as DOMPurify from 'dompurify';
import * as strings from 'SiteTourWebPartStrings';
import { CustomCheckbox } from './CustomCheckbox';

import Tour from 'reactour';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

export default class SiteTour extends React.Component<ISiteTourProps, ISiteTourState> {
  private _service: ISiteTourService;
  private _aiService: IAppInsightsService;

  constructor(props: ISiteTourProps) {
    super(props);
    this.state = {
      items: [],
      steps: [],
      isTourActive: false,
      stepIndex: 0,
      checked: false,
      isTourOpen: false
    };

    this._service = props.serviceScope.consume(SiteTourService.serviceKey);
    this._aiService = props.serviceScope.consume(AppInsightsService.serviceKey);
  }

  public async componentDidMount(): Promise<void> {
    try {
      const [items, checked] = await Promise.all([
        this._service.getTourContent(),
        this._service.getUserProfileProperties(this.props.userLoginName, this.props.siteUrl)
      ]);

      const steps = this._getSteps(items, checked);

      this.setState({
        items, checked, steps, isTourOpen: !checked
      });
    } catch (error) {
      this._aiService.trackException(error, {
        "User Email": this.props.userLoginName
      });
    }
  }

  public render(): React.ReactElement<ISiteTourProps> {
    return (
      <>
        {this.state.steps && this.state.steps.length > 0 &&
          <Tour steps={this.state.steps}
            isOpen={this.state.isTourOpen}
            onRequestClose={this._closeTour}
            startAt={0}
            rounded={5}
            onAfterOpen={this._disableBody}
            onBeforeClose={this._enableBody}
            inViewThreshold={200}
            closeWithMask={false} />
        }

        <section className={`${styles.siteTour}`}>
          <button type='button' className={styles.customButton} onClick={this._initializeTour}>
            <div className={styles.thumbnail}>
              <Icon iconName="PlaySolid" />
            </div>
            <div className={styles.buttonContent}>
              <div className={styles.buttonTitle}>Site Guided Tour</div>
              <div className={styles.buttonDescription}>Explore the site with guided tour.</div>
            </div>
          </button>
        </section>
      </>
    );
  }

  private _onCheckChange = async (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean): Promise<void> => {
    try {
      const checkedValue = isChecked !== undefined ? isChecked : false;
      await this._service.setUserProfileProperties(this.props.userLoginName, checkedValue);

      this.setState({
        checked: isChecked
      });
    } catch (error) {
      this._aiService.trackException(error, {
        "User Email": this.props.userLoginName
      });
    }
  }

  private _disableBody = (target: HTMLElement): void => disableBodyScroll(target);
  private _enableBody = (target: HTMLElement): void => enableBodyScroll(target);

  private _closeTour = (): void => {
    this.setState(
      {
        isTourOpen: false
      }
    );
  }

  private _initializeTour = (): void => {

    this.setState(
      {
        isTourOpen: true
      }
    );
  }

  private _getSteps(items: ITourItem[], checked: boolean): ISteps[] {
    const steps: ISteps[] = [];

    // Iterate through each tour item to generate Joyride steps
    items.forEach((item: ITourItem) => {
      let html: React.ReactNode = this._sanitizeAndSetInnerHTML(item.title, item.description);

      // If the item has order 0, append a CustomCheckbox to the HTML content
      if (item.order !== null && item.order.toString() === '0') {
        html = (
          <>
            {html}
            <CustomCheckbox
              label={strings.disableAutoPlay}
              checked={checked}
              onChange={this._onCheckChange}
            />
          </>
        );
      }

      const target = this._target(item.selector, item.controlId);

      if (target) {
        const step: ISteps = {
          content: html,
          selector: target
        };

        steps.push(step);
      }
    });

    return steps;
  }

  /**
 * Sanitizes the HTML content using DOMPurify and returns a React node
 * with dangerously set inner HTML.
 * @param {string} title - The title to be included in the sanitized HTML.
 * @param {string} description - The description to be included in the sanitized HTML.
 * @returns {React.ReactNode} - React node with sanitized inner HTML.
 */
  private _sanitizeAndSetInnerHTML(title: string, description: string): React.ReactNode {
    const sanitizedContent = DOMPurify.sanitize(`
      <div class="${styles.header}">
        ${title}
      </div>
      ${description}`,
      { ALLOWED_TAGS: ["div", "iframe", "ul", "li", "br", "b", "style", "span", "img"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'style'] }
    );

    return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
  }

  /**
   * Get the target selector for Joyride's step based on the provided parameters.
   * @param {string} selector - The type of selector (e.g., 'class', 'id', 'heading', 'webpartId', null).
   * @param {string} controlId - The control ID associated with the target.
   * @returns {string} - The target selector string.
   */
  private _target(selector: string, controlId: string): string {
    let target: string = '';

    switch (selector) {
      case 'class':
        target = `.${controlId}`;
        break;
      case 'id':
        target = `#${controlId}`;
        break;
      case 'heading':
        // Find heading elements with role='heading' and match the provided control ID
        document.querySelectorAll(`[role='heading']`).forEach((el) => {
          if (controlId && el.textContent && controlId.trim() === el.textContent.trim()) {
            // Find the closest ancestor with class 'ControlZone'
            const ele: HTMLElement | null = el.closest('.ControlZone');
            if (ele) {
              // Set the target selector based on the ancestor's ID
              target = `[id='${ele.id}']`;
            }
          }
        });
        break;
      case 'webpartId':
        target = `[data-sp-feature-instance-id='${controlId}']`;
        break;
      case null:
        // Default to 'body' if selector is null
        target = `body`;
        break;
      default:
        break;
    }

    return target;
  }
}