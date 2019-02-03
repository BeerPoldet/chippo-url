class ChippoForm extends React.Component {
  state = { url: '', alias: '' }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit = e => {}

  render() {
    const { url, alias } = this.state
    return (
      <form onSubmit={this.handleSubmit} action="/chippo" method="POST">
        {this.props.error && <label>{this.props.error}</label>}
        <label>Put url below:</label>
        <input
          value={url}
          name="url"
          type="text"
          onChange={this.handleChange}
        />
        <button type="submit">Chippo!</button>
        <input
          value={alias}
          name="alias"
          type="text"
          onChange={this.handleChange}
        />
      </form>
    )
  }
}

function IndexApp() {
  return <ChippoForm />
}
