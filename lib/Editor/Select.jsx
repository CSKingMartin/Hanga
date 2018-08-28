import React from 'react'
import PropTypes from 'prop-types'
import StatefulContext from 'react-stateful-context'
import EditorWrapper from './EditorWrapper'
import css from './styles.css'

// Select Editor
class SelectEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.context[props.name] || props.defaultValue
    }

    this.handleObservableChange = this.handleObservableChange.bind(this)
  }

  componentWillMount () {
    const { name, context } = this.props
    context.startObservingState(name, this.handleObservableChange)
  }

  componentWillUnmount () {
    const { name, context } = this.props
    context.stopObservingState(name, this.handleObservableChange)
  }

  handleObservableChange () {
    const { name, context } = this.props
    this.setState({ value: context[name] })
  }

  handleChange (ev) {
    const { name, context, onChange } = this.props
    context.setContextState({ [name]: ev.target.value })
    if (onChange) onChange({ [name]: ev.target.value })
  }

  render () {
    const {
      name,
      label,
      defaultValue,
      options = [],
      ...rest
    } = this.props

    return (
      <EditorWrapper name={name} label={label} defaultValue={defaultValue} {...rest}>
        <div className={css.selectWrapper}>
          <select
            id={name}
            name={name}
            value={this.state.value}
            className={css.selectInput}
            onChange={ev => this.handleChange(ev)}
          >
            {
              options
                .map(value => (
                  typeof value === 'object'
                    ? value
                    : { value, text: value }
                ))
                .map(opt => (
                  <option
                    key={opt.value}
                    value={opt.value}
                  >
                    {opt.text}
                  </option>
                ))
            }
          </select>
          <div className={css.selectIcon} />
        </div>
      </EditorWrapper>
    )
  }
}

SelectEditor.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
      })
    ])
  ),
  onChange: PropTypes.func
}

export default ({ ...args }) =>
  <StatefulContext.Consumer>
    {
      context =>
        <SelectEditor context={context} {...args} />
    }
  </StatefulContext.Consumer>
