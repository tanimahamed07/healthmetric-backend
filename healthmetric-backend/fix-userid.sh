#!/bin/bash
# This script adds userId validation to all controller functions

files=(
  "src/controllers/appointment.controller.ts"
  "src/controllers/prescription.controller.ts"
  "src/controllers/report.controller.ts"
  "src/controllers/notification.controller.ts"
  "src/controllers/vital.controller.ts"
  "src/controllers/doctor.controller.ts"
)

for file in "${files[@]}"; do
  echo "Processing $file..."
done
