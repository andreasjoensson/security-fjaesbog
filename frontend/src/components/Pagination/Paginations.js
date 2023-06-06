import { ChevronLeft } from "@material-ui/icons";
import { ChevronRight } from "@material-ui/icons";
import "./pagination.css";

const Pagination = ({
  pageDecrementBtn,
  renderPageNumbers,
  pageIncrementBtn,
  handlePrevbtn,
  handleNextbtn,
  currentPage,
  handleLoadMore,
  pages,
}) => {
  return (
    <>
      <ul className="pageNumbers">
        <li>
          <button
            className="paginationBtn"
            onClick={handlePrevbtn}
            disabled={currentPage === pages[0] ? true : false}
          >
            <ChevronLeft />
          </button>
        </li>
        {pageDecrementBtn}
        {renderPageNumbers}
        {pageIncrementBtn}

        <li>
          <button
            className="paginationBtn"
            onClick={handleNextbtn}
            disabled={currentPage === pages[pages.length - 1] ? true : false}
          >
            <ChevronRight />
          </button>
        </li>
      </ul>
    </>
  );
};

export default Pagination;
