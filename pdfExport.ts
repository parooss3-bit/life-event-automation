          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            font-size: 9px;
            color: #9ca3af;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="header-title">📊 Categories Comparison Report</div>
            <div class="header-subtitle">Service Directory Analysis</div>
          </div>

          <div class="section-title">Selected Categories Overview</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Benefit Score</th>
                <th>Market Size</th>
                <th>Monthly Searches</th>
                <th>Revenue/Listing</th>
              </tr>
            </thead>
            <tbody>
              ${categories
                .map(
                  (cat) => `
                <tr>
                  <td><span class="category-name">${cat.icon} ${cat.name}</span></td>
                  <td><span class="score-high">${cat.directoryBenefitScore}/100</span></td>
                  <td>${cat.marketSize}</td>
                  <td>${cat.avgMonthlySearches}</td>
                  <td>${cat.revenuePerListing}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="section-title">Key Benefits by Category</div>
          ${categories
            .map(
              (cat) => `
            <div style="margin-bottom: 12px; padding: 10px; background: #f0fdf4; border-left: 3px solid #16a34a; border-radius: 4px;">
              <strong>${cat.icon} ${cat.name}:</strong>
              <p style="font-size: 10px; color: #4b5563; margin-top: 4px;">${cat.keyBenefit}</p>
            </div>
          `
            )
            .join("")}

          <div class="footer">
            <p>Service Directory Comparison Report • Generated on ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const element = document.createElement("div");
  element.innerHTML = html;

  const options = {
    margin: 0,
    filename: `Service-Categories-Comparison-Report.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm" as const, format: "a4", orientation: "portrait" as const },
  };

  html2pdf().set(options).from(element).save();
}
