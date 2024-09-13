package com.example.InstaPrj.service;

import com.example.InstaPrj.dto.FeedsDTO;
import com.example.InstaPrj.dto.PageRequestDTO;
import com.example.InstaPrj.dto.PageResultDTO;
import com.example.InstaPrj.dto.PhotosDTO;
import com.example.InstaPrj.entity.Feeds;
import com.example.InstaPrj.entity.Photos;
import lombok.extern.flogger.Flogger;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public interface FeedsService {
  Long register(FeedsDTO feedsDTO);

  PageResultDTO<FeedsDTO, Object[]> getList(PageRequestDTO pageRequestDTO);

  FeedsDTO getFeeds(Long fno);

  void modify(FeedsDTO feedsDTO);

  List<String> removeWithReviewsAndPhotos(Long fno);

  void removeUuid(String uuid);


  default Map<String, Object> dtoToEntity(FeedsDTO feedsDTO) {
    Map<String, Object> entityMap = new HashMap<>();
    Feeds feeds = Feeds.builder().fno(feedsDTO.getFno())
        .title(feedsDTO.getTitle())
        .content(feedsDTO.getContent()).build();
    entityMap.put("feeds", feeds);
    List<PhotosDTO> photosDTOList = feedsDTO.getPhotosDTOList();
    if (photosDTOList != null && photosDTOList.size() > 0) {
      List<Photos> photosList = photosDTOList.stream().map(
          new Function<PhotosDTO, Photos>() {
            @Override
            public Photos apply(PhotosDTO photosDTO) {
              Photos photos = Photos.builder()
                  .path(photosDTO.getPath())
                  .imgName(photosDTO.getImgName())
                  .uuid(photosDTO.getUuid())
                  .feeds(feeds)
                  .build();
              return photos;
            }

          }
      ).collect(Collectors.toList());
      entityMap.put("photosList", photosList);
    }
    return entityMap;
  }

  default FeedsDTO entityToDto(Feeds feeds, List<Photos> photosList
      , Long reviewsCnt) {
    FeedsDTO feedsDTO = FeedsDTO.builder()
        .fno(feeds.getFno())
        .title(feeds.getTitle())
        .content(feeds.getContent())
        .regDate(feeds.getRegDate())
        .modDate(feeds.getModDate())
        .build();
    List<PhotosDTO> photosDTOList = new ArrayList<>();
    if(photosList.toArray().length > 0 && photosList.toArray()[0] != null) {
      photosDTOList = photosDTOList.stream().map(
          photos -> {
            PhotosDTO photosDTO = PhotosDTO.builder()
                .imgName(photos.getImgName())
                .path(photos.getPath())
                .uuid(photos.getUuid())
                .build();
            return photosDTO;
          }
      ).collect(Collectors.toList());
    }
    feedsDTO.setPhotosDTOList(photosDTOList);
    feedsDTO.setReviewsCnt(reviewsCnt);
    return feedsDTO;
  }
}
