package com.example.InstaPrj.controller;
import com.example.InstaPrj.dto.ReviewsDTO;
import com.example.InstaPrj.service.ReviewsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewsController {
  private final ReviewsService reviewsService;

  @GetMapping(value = "/{fno}/all", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<ReviewsDTO>> getList(@PathVariable("fno") Long fno) {
    log.info("fno: " + fno);
    List<ReviewsDTO> reviewsDTOList = reviewsService.getListOfFeeds(fno);
    return new ResponseEntity<>(reviewsDTOList, HttpStatus.OK);
  }

  @PostMapping("/{fno}")
  // @RequestBody : form이나, json 데이터를 전송받을 때
  // @RequestParam : 변수로 데이터를 전송받을 때
  public ResponseEntity<Long> register(@RequestBody ReviewsDTO reviewsDTO) {
    log.info(">>" + reviewsDTO);
    Long revieswnum = reviewsService.register(reviewsDTO);
    return new ResponseEntity<>(revieswnum, HttpStatus.OK);
  }

  @PutMapping("/{fno}/{reviewsnum}")
  public ResponseEntity<Long> modify(@RequestBody ReviewsDTO reviewsDTO) {
    log.info(">>" + reviewsDTO);
    reviewsService.modify(reviewsDTO);
    return new ResponseEntity<>(reviewsDTO.getReviewsnum(), HttpStatus.OK);
  }

  @DeleteMapping("/{fno}/{reviewsnum}")
  public ResponseEntity<Long> delete(@PathVariable Long revieswnum) {
    log.info(">>" + revieswnum);
    reviewsService.remove(revieswnum);
    return new ResponseEntity<>(revieswnum, HttpStatus.OK);
  }

}
