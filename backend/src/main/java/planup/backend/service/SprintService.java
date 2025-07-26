package planup.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import planup.backend.model.Sprint;
import planup.backend.repository.SprintRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SprintService {
    private final SprintRepository sprintRepository;

    public List<Sprint> getAllSprints() {
        return sprintRepository.findAll();
    }

    public Optional<Sprint> getSprintById(String id) {
        return sprintRepository.findById(id);
    }

    public Sprint createSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    public Sprint updateSprint(String id, Sprint sprint) {
        sprint.setId(id);
        return sprintRepository.save(sprint);
    }

    public void deleteSprint(String id) {
        sprintRepository.deleteById(id);
    }
} 