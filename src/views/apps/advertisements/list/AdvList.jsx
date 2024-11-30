// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import AdvListTable from './AdvListTable'

const AdvList = ({ tableData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AdvListTable tableData={tableData} />
      </Grid>
    </Grid>
  )
}

export default AdvList
