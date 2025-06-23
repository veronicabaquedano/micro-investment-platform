import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const PortfolioAllocation = ({ portfolio, savings = 0 }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Extract only investment objects (ignore `growth` key)
  const investments = Object.values(portfolio).filter(
    (item) => typeof item === "object" && "portfolio_name" in item
  );

  // Calculate total invested amount
  const totalInvested = investments.reduce(
    (sum, inv) => sum + parseFloat(inv.allocated_amount),
    0
  );

  // Calculate total balance (savings + all investments)
  const totalBalance = parseFloat(savings) + totalInvested;

  // Calculate current portfolio value
  const currentValue =
    portfolio.growth?.[portfolio.growth.length - 1] || totalInvested * 1.1; // Increase by 10% for testing;

  // Calculate total gains and percentage increase
  const totalGains = currentValue - totalInvested;
  const percentageIncrease =
    totalInvested > 0
      ? ((totalGains / totalInvested) * 100).toFixed(2)
      : "0.00";

  return (
    <Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Portfolio Allocation
      </Typography>
      {investments.length > 0 ? (
        <>
          {investments.map((investment) => (
            <Typography key={investment.id} variant="body1" sx={{ mb: 1 }}>
              <strong>{investment.portfolio_name}:</strong> $
              {Number(investment.allocated_amount).toFixed(2)}
            </Typography>
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowDetails(!showDetails)}
            sx={{ my: 2 }}
          >
            {showDetails
              ? "Hide Details"
              : `View Portfolio (${percentageIncrease}% growth)`}
          </Button>

          <Collapse in={showDetails}>
            <Box
              sx={{
                mt: 2,
                bgcolor: "background.default",
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Detailed Breakdown
              </Typography>
              <List dense>
                {investments.map((investment) => {
                  const amount = parseFloat(investment.allocated_amount) || 0;
                  const percentage = ((amount / totalBalance) * 100).toFixed(2);
                  return (
                    <ListItem key={investment.id} disableGutters>
                      <ListItemText
                        primary={`${
                          investment.portfolio_name
                        }: $${amount.toFixed(2)} (${percentage}%)`}
                      />
                    </ListItem>
                  );
                })}
                <Divider />
                <ListItem disableGutters>
                  <ListItemText
                    primary={
                      <span>
                        <strong>Savings:</strong> $
                        {parseFloat(savings).toFixed(2)} (
                        {((savings / totalBalance) * 100).toFixed(2)}%)
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText
                    primary={
                      <span>
                        <strong>Total Gains:</strong> ${totalGains.toFixed(2)} (
                        {percentageIncrease}%)
                      </span>
                    }
                  />
                </ListItem>
              </List>
            </Box>
          </Collapse>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No portfolio data available.
        </Typography>
      )}
    </Box>
  );
};

export default PortfolioAllocation;
