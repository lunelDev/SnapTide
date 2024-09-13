package com.example.InstaPrj.service;
import com.example.InstaPrj.dto.ReviewsDTO;
import com.example.InstaPrj.entity.ClubMember;
import com.example.InstaPrj.entity.Feeds;
import com.example.InstaPrj.entity.Reviews;

import java.util.List;

public interface ReviewsService {
  List<ReviewsDTO> getListOfFeeds(Long fno);

  Long register(ReviewsDTO reviewsDTO);

  void modify(ReviewsDTO reviewsDTO);

  void remove(Long revieswnum);

  public default Reviews dtoToEntity(ReviewsDTO reviewsDTO) {
    Reviews review = Reviews.builder()
        .reviewsnum(reviewsDTO.getReviewsnum())
        .feeds(Feeds.builder().fno(reviewsDTO.getFno()).build())
        .clubMember(ClubMember.builder().cno(reviewsDTO.getMid()).build())
        .text(reviewsDTO.getText())
        .build();
    return review;
  }

  default ReviewsDTO entityToDto(Reviews reviews) {
    ReviewsDTO reviewDTO = ReviewsDTO.builder()
        .reviewsnum(reviews.getReviewsnum())
        .fno(reviews.getFeeds().getFno())
        .mid(reviews.getClubMember().getCno())
        .nickname(reviews.getClubMember().getName())
        .email(reviews.getClubMember().getEmail())
        .text(reviews.getText())
        .regDate(reviews.getRegDate())
        .modDate(reviews.getModDate())
        .build();
    return reviewDTO;
  }
}
