import React from "react";
import { Typography, List, ListItem, ListItemText, Box } from "@mui/material";

const RecentTransactions = ({ transactions }) => {
  return (
    <Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Recent Transactions
      </Typography>
      {transactions.length > 0 ? (
        <List>
          {transactions.map((transaction) => {
            const amount = Number(transaction.amount) || 0;
            return (
              <ListItem key={transaction.id} disableGutters>
                <ListItemText
                  primary={
                    <>
                      <strong>
                        {transaction.description || "No Description"}
                      </strong>
                      : ${amount.toFixed(2)}
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No recent transactions.
        </Typography>
      )}
    </Box>
  );
};

export default RecentTransactions;
