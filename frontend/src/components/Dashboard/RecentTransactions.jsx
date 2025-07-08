import React from "react";
import { Typography, List, ListItem, ListItemText, Box } from "@mui/material";

const RecentTransactions = ({ transactions }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        color="text.secondary"
        gutterBottom
        sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
      >
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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.95rem", md: "1rem" } }}
        >
          No recent transactions.
        </Typography>
      )}
    </Box>
  );
};

export default RecentTransactions;
