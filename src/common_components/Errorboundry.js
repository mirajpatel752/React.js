import React, { Component } from 'react';

class Errorboundry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true
        };
    }
    
    render() {
        if (this.state.hasError) {
            alert('Something went wrong so required reloading.')
            window.location.reload()
            return;
        }
        return this.props.children;
    }
}

export default Errorboundry;
