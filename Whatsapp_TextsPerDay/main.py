import re
import sys
import os
from collections import defaultdict
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

# Ensure correct file extension and handle exceptions
try:
    chatFile = os.path.abspath(sys.argv[1])
    if not chatFile.endswith(".txt"):
        raise ValueError("Wrong file extension")
except (IndexError, ValueError):
    print("Usage: python script.py <chat_file.txt>")
    sys.exit(1)

# Open and read the chat file
with open(chatFile, encoding="utf-8") as chat:
    # Define regex patterns for date, time, and message
    dateRegex = r"[\d]{1,2}/[\d]{1,2}/[\d]{2}"
    timeRegex = r"[\d]{2}:[\d]{2}"
    messageRegex = rf"({dateRegex}), ({timeRegex}) - (.*?): (.*)"

    # Initialize data storage
    lines = []

    # Read and process each line in the chat file
    for line in chat:
        match = re.match(messageRegex, line)
        if match:
            date, time, sender, text = match.groups()
            lines.append([date, time, sender, text])
        else:
            # Handle multiline messages by appending to the last message's text
            if lines:
                lines[-1][-1] += "\n" + line.strip()

# Organize data by date and count messages per sender per day
message_counts = defaultdict(lambda: defaultdict(int))
total_counts_per_day = defaultdict(int)
for date, time, sender, text in lines:
    message_counts[date][sender] += 1
    total_counts_per_day[date] += 1

# Filter out days with fewer than 10 messages
filtered_dates = [date for date, total in total_counts_per_day.items() if total >= 10]
filtered_dates.sort(key=lambda date: datetime.strptime(date, "%d/%m/%y"))

# Determine the date range including all relevant days
if filtered_dates:
    start_date = datetime.strptime(filtered_dates[0], "%d/%m/%y")
    end_date = datetime.strptime(filtered_dates[-1], "%d/%m/%y")
else:
    start_date = end_date = datetime.strptime(sorted(total_counts_per_day.keys())[0], "%d/%m/%y")

# Create a list of all dates in the range, including those with zero records
all_dates = []
current_date = start_date
while current_date <= end_date:
    all_dates.append(current_date.strftime("%d/%m/%y"))
    current_date += timedelta(days=1)

# Prepare data for plotting, ensuring dates with fewer than 10 messages have zero counts
senders = set(sender for day in message_counts.values() for sender in day.keys())
sender_data = {sender: [message_counts[date].get(sender, 0) if date in filtered_dates else 0 for date in all_dates] for sender in senders}

# Plotting the daily histogram
fig, ax = plt.subplots()

bottom = [0] * len(all_dates)
for sender, counts in sender_data.items():
    bars = ax.bar(all_dates, counts, bottom=bottom, label=sender)
    for bar, count in zip(bars, counts):
        if count > 0:
            ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + bar.get_y(), str(count), ha="center", va="bottom")
    bottom = [i + j for i, j in zip(bottom, counts)]

# Customize the plot
ax.set_xlabel("Date")
ax.set_ylabel("Number of Messages")
ax.set_title("Messages per Sender per Day (Days with >= 10 Messages)")
ax.legend()
plt.xticks(rotation=90)
plt.tight_layout()

# Prepare data for the monthly plot
monthly_counts = defaultdict(lambda: defaultdict(int))
for date, counts_by_sender in message_counts.items():
    month = datetime.strptime(date, "%d/%m/%y").strftime("%Y-%m")
    for sender, count in counts_by_sender.items():
        monthly_counts[month][sender] += count

# Sort months
sorted_months = sorted(monthly_counts.keys())
monthly_sender_data = {sender: [monthly_counts[month].get(sender, 0) for month in sorted_months] for sender in senders}

# Plotting the monthly histogram
fig, ax = plt.subplots()

bottom = [0] * len(sorted_months)
for sender, counts in monthly_sender_data.items():
    bars = ax.bar(sorted_months, counts, bottom=bottom, label=sender)
    for bar, count in zip(bars, counts):
        if count > 0:
            ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + bar.get_y(), str(count), ha="center", va="bottom")
    bottom = [i + j for i, j in zip(bottom, counts)]

# Customize the plot
ax.set_xlabel("Month")
ax.set_ylabel("Number of Messages")
ax.set_title("Messages per Sender per Month")
ax.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
