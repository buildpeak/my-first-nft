import { useEffect, useState } from "react";
import { fetchMetadata, fetchImage, getTokenURI } from "../util/nft.js";

const NFTImage = ({ tokenId }) => {
  const [metadata, setMetadata] = useState({});
  const [imageURI, setImageURI] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getTokenURI(tokenId)
      .then((uri) => {
        fetchMetadata(uri)
          .then((metadata) => {
            setMetadata(metadata);

            fetchImage(metadata.image)
              .then((blob) => {
                setImageURI(URL.createObjectURL(blob));
              })
              .catch((err) => {
                setError(err.message);
              });
          })
          .catch((err) => {
            setError(err.message);
          });
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [tokenId]);

  return (
    <div>
      <h5>
        #{tokenId} Name: {metadata.name}
      </h5>
      <p>Description: {metadata.description}</p>
      <img alt={"NFT"} src={imageURI || "img/placeholder.png"}></img>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default NFTImage;
