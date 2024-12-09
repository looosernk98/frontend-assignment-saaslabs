import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom'
import App from './App';
import { waitFor } from "@testing-library/dom";


beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { "s.no": 1, "percentage.funded": "743", "amt.pledged": "70662" },
          { "s.no": 2, "percentage.funded": "650", "amt.pledged": "65432" },
          { "s.no": 3, "percentage.funded": "812", "amt.pledged": "81234" },
          { "s.no": 4, "percentage.funded": "920", "amt.pledged": "92000" },
          { "s.no": 5, "percentage.funded": "1050", "amt.pledged": "105000" },
          { "s.no": 6, "percentage.funded": "1100", "amt.pledged": "110000" },
        ]),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});


describe('Test App component', ()=>{

  it('Show Table Text', () => {
    render(<App />);
    const tableText = screen.getByText('Table');
    expect(tableText).toBeInTheDocument();
  });
  
  it('render all the columns', () => {
    const {container} = render(<App />);
    expect(container.querySelectorAll('th').length).toBe(3)
  })

  it('should select page 10 from select records per pages dropdown', () =>{
     render(<App />);
     const dropdown = document.querySelector('.record-per-page')
     fireEvent.change(dropdown, {target:{value: 50}})
     const diplayedOptions = screen.getAllByTestId('per_page_record_option')
     diplayedOptions.forEach((option) => {
       if(option.selected){
        expect(option).toHaveTextContent('50')
       }
     })
  })

 
  it("renders the table heading", () => {
    render(<App />);
    const heading = screen.getByText(/Table/i);
    expect(heading).toBeInTheDocument();
  });

  it("fetches and displays initial data", async () => {
    render(<App />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("743")).toBeInTheDocument();
    });

    // Check that the first row of data is displayed
    const firstRow = screen.getByText("70662");
    expect(firstRow).toBeInTheDocument();
  });

  it("handles pagination (next and previous buttons)", async () => {
    render(<App />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("743"));
    });

    // Click next page
    const nextButton = screen.getByAltText("goto_next_page");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("1100"));
    });

    // Click previous page
    const prevButton = screen.getByAltText("goto_prev_page");
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText("743"));
    });
  });

  it("changes records per page", async () => {
    render(<App />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("743"));
    });

    // Change records per page
    const recordsPerPageDropdown = screen.getByText("Records per page").nextSibling;
    fireEvent.change(recordsPerPageDropdown, { target: { value: "10" } });

    await waitFor(() => {
      const allRows = screen.getAllByRole("row");
      expect(allRows.length).toBeGreaterThan(5); // Expect more rows
    });
  });

  it("updates page when selecting from dropdown", async () => {
    render(<App />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("743"));
    });

    // Change page from dropdown
    const pageDropdown = screen.getByTestId("select-page");
    fireEvent.change(pageDropdown, { target: { value: "2" } });
    const pageOptions = screen.getAllByTestId('page_option')
    pageOptions.forEach((option) => {
      if(option.selected){
       expect(option).toHaveTextContent('2')
      }
    })
    await waitFor(() => {
      expect(screen.getByText("1100"));
    });
  });

  it("disables next and previous buttons appropriately", async () => {
    render(<App />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("743"));
    });

    // Check that the previous button is disabled on the first page
    const prevButton = screen.getByAltText("goto_prev_page");
    expect(prevButton.parentElement).toHaveClass("disabled");

    // Move to the last page
    const nextButton = screen.getByAltText("goto_next_page");
    fireEvent.click(nextButton);
 
    await waitFor(() => {
      expect(nextButton.parentElement).toHaveClass("disabled");
    });
  });
})
