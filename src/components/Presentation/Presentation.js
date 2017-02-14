import React, { PropTypes } from 'react';

class Presentation extends React.Component {
  static propTypes = {
    documentId: PropTypes.string.isRequired,
  };

  render = () => (
    <div
      style={{
        paddingTop: 'calc(56.25% + 29px)',
        position: 'relative',
      }}
    >
      <iframe
        src={`https://docs.google.com/presentation/d/${this.props.documentId}/embed?start=false&loop=false&delayms=3000`}
        frameBorder="0"
        allowFullScreen="true"
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

Presentation.defaultProps = {
  documentId: '1RiQPMqXEz7kyuDFDHoZW3_RwgWqKMma0D9hlZmnzqiE',
};

export default Presentation;
