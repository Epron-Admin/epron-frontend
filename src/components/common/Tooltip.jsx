import React from "react";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from "@mui/system";

const TooltipComp = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#2AA458',
    color: "white",
    fontSize: 11,
  },
}));

export default TooltipComp;
