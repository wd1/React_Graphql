/**  -*- mode: react; -*-
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {
  PropTypes,
} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Stories.css';
import Gallery from '../../components/Gallery';
import data from '../../public/stories-gallery/links.json';

class Content extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Gallery elements={data} thumbnailField='imageFile' thumbnailBase='/stories-gallery/' />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Content);
