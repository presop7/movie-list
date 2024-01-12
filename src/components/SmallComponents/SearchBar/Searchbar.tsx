import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Box,
  ClickAwayListener,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { SearchList, SearchResults } from "../../../services/apiTypes";
import { callApi } from "../../../services/callApi";
import { getSearchMulti } from "../../../services/Search/apiGetSearchMulti";
import { Link } from "react-router-dom";

interface SearchBarProps {
  iconColor?: string;
  iconMargin?: string;
  inputBackground: string;
  inputMargin?: string;
  searchData?: SearchResults[];
  setSearchData?: Dispatch<SetStateAction<SearchResults[]>>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  iconColor,
  iconMargin,
  inputBackground,
  inputMargin,
}) => {
  const [isInputOpen, setIsInputOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [searchData, setSearchData] = useState<SearchResults[]>([]);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        if (text) {
          const searchData = await callApi<SearchList>({
            query: getSearchMulti(text),
          });
          console.log(searchData);
          setSearchData(searchData.results);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [text]);

  const handleIconClick = () => {
    setIsInputOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleClickAway = () => {
    setText("");
    setIsInputOpen(false);
  };

  const handleMouseEnter = () => {
    setIsInputOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative" }}>
        {!isInputOpen ? (
          <IconButton onClick={handleIconClick} onMouseEnter={handleMouseEnter}>
            <SearchIcon sx={{ color: iconColor, margin: iconMargin }} />
          </IconButton>
        ) : (
          <InputBase
            value={text}
            onChange={handleInputChange}
            autoFocus
            placeholder="Search..."
            endAdornment={<SearchIcon />}
            sx={{
              backgroundColor: inputBackground,
              margin: inputMargin,
              padding: "0 1rem",
              borderRadius: "0.5rem",
              border: "0",
              unset: "all",
            }}
            inputProps={{
              style: { border: "none", textDecoration: "none" },
            }}
          />
        )}

        <Box
          sx={{
            position: { sx: "initial", sm: "absolute" },
            maxWidth: { sx: "none", sm: "24rem" },
            maxHeight: { sx: "none", sm: "27rem" },
            top: "4rem",
            left: "0rem",
            zIndex: "999",
            overflowY: { sx: "none", sm: "scroll" },
            backgroundColor: `${theme.palette.primary.main}`,
            scrollbarWidth: "1rem",
          }}
        >
          {text &&
            (searchData.length === 0 ? (
              <Typography
                component="p"
                variant="body2"
                sx={{
                  textAlign: "center",
                  py: "4rem",
                  px: "5rem",
                  mt: { xs: "1rem", sm: 0 },
                }}
              >
                No items found
              </Typography>
            ) : (
              <Box>
                {searchData.map((item) => {
                  if (!item.poster_path) {
                    return "";
                  }
                  return (
                    <Link
                      to={
                        item.media_type === "tv"
                          ? `/series/${item.id}`
                          : `/movie/${item.id}`
                      }
                      style={{ textDecoration: "none", color: "inherit" }}
                      onClick={() => setText("")}
                    >
                      <Box
                        margin={2}
                        display={"flex"}
                        gap={2}
                        sx={{
                          ":hover": {
                            backgroundColor: theme.palette.secondary.main,
                            cursor: "pointer",
                          },
                          padding: "1rem",
                          borderRadius: "1rem",
                        }}
                      >
                        <Box
                          key={item.id}
                          minWidth={120}
                          height={160}
                          sx={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${item.poster_path})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            borderRadius: "5px",
                            marginBottom: 1,
                          }}
                        ></Box>
                        <Box>
                          <Typography component="p" variant="body1">
                            {item.title}
                          </Typography>
                          <Typography component="p" variant="body2">
                            IMDb Score: {item.vote_average}
                          </Typography>
                          <Typography component="p" variant="body1">
                            {item.release_date || item.first_air_date}
                          </Typography>
                          <Typography>
                            {item.media_type !== "tv" ? "Movie" : "Series"}
                          </Typography>
                        </Box>
                      </Box>
                    </Link>
                  );
                })}
              </Box>
            ))}
        </Box>
      </Box>
    </ClickAwayListener>
  );
};
export default SearchBar;
