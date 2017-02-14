/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import serialize from 'serialize-javascript';
import { analytics } from '../config';

class Html extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    style: PropTypes.string,
    script: PropTypes.string,
    state: PropTypes.object,
    chunk: PropTypes.string,
    children: PropTypes.string,
  };

  render() {
    const { title, description, style, script, state, chunk, children } = this.props;
    return (
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          {/*<link rel="stylesheet" href="/css/bootstrap.theme.cosmo.min.css" />*/}
          {style && <style id="css" dangerouslySetInnerHTML={{ __html: style }} />}

          {/* Remove thes two dependecies after porting all graphs to D3 */}
          <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
          <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          { state && (
            <script
              dangerouslySetInnerHTML={{ __html:
              `window.APP_STATE=${serialize(state, { isJSON: true })}` }}
            />
          )}
          {script && <script src={script} />}
          {chunk && <script src={chunk} />}
          {analytics.google.trackingId &&
            <script
              dangerouslySetInnerHTML={{ __html:
              'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
              `ga('create','${analytics.google.trackingId}','auto');ga('send','pageview')` }}
            />
          }
          {analytics.google.trackingId &&
            <script src="https://www.google-analytics.com/analytics.js" async defer />
          }
        </body>
      </html>
    );
  }
}

export default Html;
