import React from 'react'
import PropTypes from 'prop-types'

const TestWithMockData = ({data}) => {
  return (
    <div>
        <ul>
            {data.map(item => (
                <li key={item.id}>
                    {item.id}
                    {item.first_name},
                    {item.last_name},
                    {item.email}

                </li>
            ))}
        </ul>
    </div>
  )
}

TestWithMockData.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string,
    })
  ).isRequired,
}

export default TestWithMockData